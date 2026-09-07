'use client';

import React, { useState, useMemo } from 'react';
import styles from './LegalDocumentViewer.module.css';
import { Search, ChevronRight, Hash, Bookmark, BookOpen } from 'lucide-react';

interface LegalDocumentViewerProps {
  content: string;
  title?: string;
  version?: string;
  effectiveDate?: string;
  showTableOfContents?: boolean;
  inModal?: boolean;
  hideToolbar?: boolean;
  searchQuery?: string;
  onSearchQueryChange?: (q: string) => void;
}

interface ParsedSection {
  id: string;
  number?: string;
  title: string;
  rawContent: string[];
}

export default function LegalDocumentViewer({
  content,
  title,
  version,
  effectiveDate,
  showTableOfContents = true,
  inModal = false,
  hideToolbar = false,
  searchQuery: externalSearchQuery,
  onSearchQueryChange,
}: LegalDocumentViewerProps) {
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const setSearchQuery = onSearchQueryChange || setInternalSearchQuery;
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  // Parse markdown content into structured sections and TOC
  const { headerBlocks, sections } = useMemo(() => {
    const lines = content.split('\n');
    const headerLines: string[] = [];
    const parsedSections: ParsedSection[] = [];
    let currentSection: ParsedSection | null = null;
    let inHeader = true;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Heading 3 is a main numbered clause (e.g. ### 1. Agreement to Terms or ### Section 1)
      if (trimmed.startsWith('### ')) {
        inHeader = false;
        if (currentSection) {
          parsedSections.push(currentSection);
        }

        const rawHeading = trimmed.replace('### ', '').trim();
        const match = rawHeading.match(/^(\d+[\.\)]?|[A-Z][\.\)]?)\s*(.*)$/);
        const sectionNum = match ? match[1].replace(/[\.\)]/, '') : undefined;
        const sectionTitle = match ? match[2] : rawHeading;
        const sectionId = `section-${parsedSections.length + 1}`;

        currentSection = {
          id: sectionId,
          number: sectionNum,
          title: sectionTitle || rawHeading,
          rawContent: [],
        };
      } else if (inHeader) {
        if (trimmed && !trimmed.startsWith('# ') && !trimmed.startsWith('## ') && trimmed !== '---') {
          headerLines.push(line);
        }
      } else if (currentSection) {
        currentSection.rawContent.push(line);
      }
    }

    if (currentSection) {
      parsedSections.push(currentSection);
    }

    return {
      headerBlocks: headerLines,
      sections: parsedSections,
    };
  }, [content]);

  // Helper to format bold text & search highlighting
  const renderInlineFormatted = (str: string, keyPrefix: string) => {
    const query = searchQuery.trim().toLowerCase();
    const parts = str.split(/(\*\*.*?\*\*)/g);

    return parts.map((part, pIdx) => {
      const isBold = part.startsWith('**') && part.endsWith('**');
      const cleanText = isBold ? part.slice(2, -2) : part;

      if (query && cleanText.toLowerCase().includes(query)) {
        // Highlight query matches
        const subParts = cleanText.split(new RegExp(`(${query})`, 'gi'));
        const highlighted = subParts.map((sub, sIdx) =>
          sub.toLowerCase() === query ? (
            <mark key={`mark-${keyPrefix}-${pIdx}-${sIdx}`} className={styles.searchHighlight}>
              {sub}
            </mark>
          ) : (
            sub
          )
        );

        return isBold ? (
          <strong key={`${keyPrefix}-${pIdx}`} className={styles.boldText}>
            {highlighted}
          </strong>
        ) : (
          <React.Fragment key={`${keyPrefix}-${pIdx}`}>{highlighted}</React.Fragment>
        );
      }

      if (isBold) {
        return (
          <strong key={`${keyPrefix}-${pIdx}`} className={styles.boldText}>
            {cleanText}
          </strong>
        );
      }

      return <React.Fragment key={`${keyPrefix}-${pIdx}`}>{cleanText}</React.Fragment>;
    });
  };

  // Render a block of section lines with paragraphs, lists, and callouts
  const renderSectionLines = (lines: string[], sectionId: string) => {
    const nodes: React.ReactNode[] = [];
    let listBuffer: { type: 'ul' | 'ol'; items: string[] } | null = null;

    const flushList = () => {
      if (listBuffer) {
        if (listBuffer.type === 'ul') {
          nodes.push(
            <ul key={`${sectionId}-ul-${nodes.length}`} className={styles.bulletList}>
              {listBuffer.items.map((item, idx) => (
                <li key={`${sectionId}-li-${idx}`} className={styles.listItem}>
                  {renderInlineFormatted(item, `${sectionId}-item-${idx}`)}
                </li>
              ))}
            </ul>
          );
        } else {
          nodes.push(
            <ol key={`${sectionId}-ol-${nodes.length}`} className={styles.numberedList}>
              {listBuffer.items.map((item, idx) => (
                <li key={`${sectionId}-oli-${idx}`} className={styles.numberedItem}>
                  {renderInlineFormatted(item, `${sectionId}-oitem-${idx}`)}
                </li>
              ))}
            </ol>
          );
        }
        listBuffer = null;
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      if (!trimmed || trimmed === '---') {
        flushList();
        return;
      }

      // Unordered list item
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('● ')) {
        const itemText = trimmed.replace(/^[\*\-●]\s+/, '');
        if (!listBuffer || listBuffer.type !== 'ul') {
          flushList();
          listBuffer = { type: 'ul', items: [] };
        }
        listBuffer.items.push(itemText);
        return;
      }

      // Ordered list item
      if (/^\d+[\.\)]\s+/.test(trimmed)) {
        const itemText = trimmed.replace(/^\d+[\.\)]\s+/, '');
        if (!listBuffer || listBuffer.type !== 'ol') {
          flushList();
          listBuffer = { type: 'ol', items: [] };
        }
        listBuffer.items.push(itemText);
        return;
      }

      flushList();

      // Heading 4 or bold sub-clause
      if (trimmed.startsWith('#### ')) {
        nodes.push(
          <h5 key={`${sectionId}-h5-${index}`} className={styles.subHeading}>
            {trimmed.replace('#### ', '')}
          </h5>
        );
        return;
      }

      // Callout box for important notices
      if (trimmed.startsWith('> ')) {
        nodes.push(
          <div key={`${sectionId}-quote-${index}`} className={styles.calloutBox}>
            {renderInlineFormatted(trimmed.replace('> ', ''), `${sectionId}-q-${index}`)}
          </div>
        );
        return;
      }

      // Standard Paragraph
      nodes.push(
        <p key={`${sectionId}-p-${index}`} className={styles.paragraph}>
          {renderInlineFormatted(trimmed, `${sectionId}-p-${index}`)}
        </p>
      );
    });

    flushList();
    return nodes;
  };

  const scrollToSection = (id: string) => {
    setSelectedSectionId(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Filter sections by search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const q = searchQuery.toLowerCase();
    return sections.filter(
      (sec) =>
        sec.title.toLowerCase().includes(q) ||
        sec.number?.toLowerCase().includes(q) ||
        sec.rawContent.some((line) => line.toLowerCase().includes(q))
    );
  }, [sections, searchQuery]);

  return (
    <div className={styles.viewerContainer}>
      {/* Search and Navigation Toolbar */}
      {!hideToolbar && (
        <div className={`${styles.toolbar} ${inModal ? styles.toolbarInModal : ''}`}>
          <div className={styles.searchBox}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search clauses, refunds, waivers, terms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className={styles.clearSearchBtn}
                onClick={() => setSearchQuery('')}
              >
                Clear
              </button>
            )}
          </div>

          <div className={styles.statsBadge}>
            <BookOpen size={14} />
            <span>
              {sections.length} Clauses {searchQuery ? `(${filteredSections.length} matched)` : ''}
            </span>
          </div>
        </div>
      )}

      <div
        className={`${styles.contentLayout} ${
          !showTableOfContents || sections.length === 0 ? styles.contentLayoutNoToc : ''
        }`}
      >
        {/* Table of Contents Sidebar */}
        {showTableOfContents && sections.length > 0 && (
          <aside className={styles.tocSidebar}>
            <div className={styles.tocHeader}>
              <Bookmark size={14} />
              <span>Table of Contents</span>
            </div>
            <nav className={styles.tocList}>
              {sections.map((sec) => {
                const isSelected = selectedSectionId === sec.id;
                const isMatched =
                  searchQuery.trim() &&
                  (sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    sec.rawContent.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase())));

                return (
                  <button
                    key={sec.id}
                    type="button"
                    className={`${styles.tocItem} ${isSelected ? styles.tocItemActive : ''} ${
                      isMatched ? styles.tocItemMatched : ''
                    }`}
                    onClick={() => scrollToSection(sec.id)}
                  >
                    <span className={styles.tocNumber}>{sec.number || '#'}</span>
                    <span className={styles.tocTitle}>{sec.title}</span>
                    <ChevronRight size={12} className={styles.tocArrow} />
                  </button>
                );
              })}
            </nav>
          </aside>
        )}

        {/* Main Document Body */}
        <div className={styles.documentBody}>
          {/* Metadata Banner */}
          {(title || version || effectiveDate || headerBlocks.length > 0) && (
            <div className={styles.metaBanner}>
              {title && <h2 className={styles.documentMainTitle}>{title}</h2>}
              <div className={styles.metaGrid}>
                {version && (
                  <div className={styles.metaItem}>
                    <span className={styles.metaKey}>Version</span>
                    <span className={styles.metaValueTag}>{version}</span>
                  </div>
                )}
                {effectiveDate && (
                  <div className={styles.metaItem}>
                    <span className={styles.metaKey}>Effective Date</span>
                    <span className={styles.metaVal}>{effectiveDate}</span>
                  </div>
                )}
                <div className={styles.metaItem}>
                  <span className={styles.metaKey}>Jurisdiction</span>
                  <span className={styles.metaVal}>Missouri (Boone County)</span>
                </div>
              </div>

              {headerBlocks.length > 0 && (
                <div className={styles.headerInfoText}>
                  {headerBlocks.map((hLine, hIdx) => (
                    <div key={`h-info-${hIdx}`} className={styles.headerInfoLine}>
                      {renderInlineFormatted(hLine.trim(), `head-${hIdx}`)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Render All Clauses */}
          {filteredSections.length === 0 ? (
            <div className={styles.emptyResults}>
              <p>No clauses match your search for &quot;{searchQuery}&quot;.</p>
              <button
                type="button"
                className={styles.resetSearchBtn}
                onClick={() => setSearchQuery('')}
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className={styles.sectionsList}>
              {filteredSections.map((sec) => (
                <section
                  key={sec.id}
                  id={sec.id}
                  className={`${styles.sectionCard} ${
                    selectedSectionId === sec.id ? styles.sectionCardActive : ''
                  }`}
                >
                  <div className={styles.sectionHeader}>
                    {sec.number && (
                      <span className={styles.sectionBadge}>
                        <Hash size={12} />
                        Section {sec.number}
                      </span>
                    )}
                    <h3 className={styles.sectionTitle}>
                      {renderInlineFormatted(sec.title, `title-${sec.id}`)}
                    </h3>
                  </div>

                  <div className={styles.sectionContent}>
                    {renderSectionLines(sec.rawContent, sec.id)}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
