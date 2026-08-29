import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      ownerData,
      pets,
      healthData,
      homeAccessData,
      emergencyData,
      bookingRef,
    } = body;

    if (!ownerData?.email) {
      return NextResponse.json(
        { success: false, message: 'Owner email is required to submit the intake form.' },
        { status: 400 },
      );
    }

    const email = ownerData.email.trim().toLowerCase();

    const result = await prisma.$transaction(async (tx) => {
      // 1. Locate or create customer record
      let customer = await tx.customer.findUnique({
        where: { email },
      });

      if (!customer) {
        customer = await tx.customer.create({
          data: {
            email,
            firstName: ownerData.firstName?.trim() || '',
            lastName: ownerData.lastName?.trim() || '',
            phone: ownerData.phone?.trim() || '',
            address: ownerData.serviceAddress?.trim() || '',
            isColumbiaResident: Boolean(ownerData.confirmColumbiaResidency ?? true),
            isNewCustomer: true,
          },
        });
      } else {
        // Update contact details
        customer = await tx.customer.update({
          where: { id: customer.id },
          data: {
            firstName: ownerData.firstName?.trim() || customer.firstName,
            lastName: ownerData.lastName?.trim() || customer.lastName,
            phone: ownerData.phone?.trim() || customer.phone,
            address: ownerData.serviceAddress?.trim() || customer.address,
            isColumbiaResident:
              ownerData.confirmColumbiaResidency !== undefined
                ? Boolean(ownerData.confirmColumbiaResidency)
                : customer.isColumbiaResident,
          },
        });
      }

      // 2. Locate booking if bookingRef supplied
      let bookingId: number | null = null;
      if (bookingRef) {
        const booking = await tx.booking.findUnique({
          where: { reference: bookingRef.trim() },
        });
        if (booking) {
          bookingId = booking.id;
        }
      }

      // 3. Upsert or create pets with detailed care instructions
      if (Array.isArray(pets)) {
        for (const petItem of pets) {
          const name = petItem.petName?.trim();
          if (!name) continue;

          const existingPet = await tx.pet.findFirst({
            where: {
              customerId: customer.id,
              name,
            },
          });

          if (existingPet) {
            await tx.pet.update({
              where: { id: existingPet.id },
              data: {
                type: petItem.petType?.trim() || existingPet.type,
                breed: petItem.breed?.trim() || existingPet.breed,
                age: petItem.age?.trim() || existingPet.age,
                photoUrl: petItem.optionalPetPhoto || existingPet.photoUrl,
                feedingRoutine: petItem.feedingRoutine || existingPet.feedingRoutine,
                exerciseRoutine: petItem.exerciseRoutine || existingPet.exerciseRoutine,
                temperamentNotes: petItem.temperamentNotes || existingPet.temperamentNotes,
                careInstructions:
                  petItem.generalCareInstructions || existingPet.careInstructions,
              },
            });
          } else {
            await tx.pet.create({
              data: {
                customerId: customer.id,
                name,
                type: petItem.petType?.trim() || 'Dog',
                breed: petItem.breed?.trim() || null,
                age: petItem.age?.trim() || null,
                photoUrl: petItem.optionalPetPhoto || null,
                feedingRoutine: petItem.feedingRoutine || null,
                exerciseRoutine: petItem.exerciseRoutine || null,
                temperamentNotes: petItem.temperamentNotes || null,
                careInstructions: petItem.generalCareInstructions || null,
              },
            });
          }
        }
      }

      // 4. Create IntakeProfile
      const intakeProfile = await tx.intakeProfile.create({
        data: {
          customerId: customer.id,
          bookingId: bookingId,
          bookingRef: bookingRef?.trim() || null,

          // Health Care
          takesMedication: healthData?.takesMedication || null,
          medicationName: healthData?.medicationName || null,
          dosageInstructions: healthData?.dosageInstructions || null,
          knownAllergies: healthData?.knownAllergies || null,
          medicalConditions: healthData?.medicalConditions || null,
          veterinarianName: healthData?.veterinarianName || null,
          veterinaryClinic: healthData?.veterinaryClinic || null,
          veterinaryPhone: healthData?.veterinaryPhone || null,
          additionalHealthNotes: healthData?.additionalHealthNotes || null,

          // Home Access
          primaryEntryMethod: homeAccessData?.primaryEntryMethod || null,
          secondaryEntryMethod: homeAccessData?.secondaryEntryMethod || null,
          entryInstructions: homeAccessData?.entryInstructions || null,
          doorCode: homeAccessData?.doorCode || null,
          garageCode: homeAccessData?.garageCode || null,
          alarmCode: homeAccessData?.alarmCode || null,
          keyLockboxLocation: homeAccessData?.keyLockboxLocation || null,
          parkingInstructions: homeAccessData?.parkingInstructions || null,
          additionalHomeNotes: homeAccessData?.additionalHomeNotes || null,

          // Emergency Contact
          primaryName: emergencyData?.primaryName || null,
          primaryRelationship: emergencyData?.primaryRelationship || null,
          primaryPhone: emergencyData?.primaryPhone || null,
          primaryEmail: emergencyData?.primaryEmail || null,
          secondaryName: emergencyData?.secondaryName || null,
          secondaryRelationship: emergencyData?.secondaryRelationship || null,
          secondaryPhone: emergencyData?.secondaryPhone || null,
          vetAuthorization: emergencyData?.vetAuthorization || null,
          altKeyHolder: emergencyData?.altKeyHolder || null,
          emergencyNotes: emergencyData?.emergencyNotes || null,

          confirmedAccuracy: true,
          status: 'COMPLETED',
        },
      });

      // 5. System audit log
      await tx.systemLog.create({
        data: {
          action: 'INTAKE_SUBMITTED',
          details: `Intake form submitted for ${customer.firstName} ${customer.lastName} (${customer.email})${bookingRef ? `, linked to booking ${bookingRef}` : ''}.`,
        },
      });

      return {
        customer,
        intakeProfile,
      };
    });

    logger.info(`Intake form successfully recorded for customer ${result.customer.email}`);

    return NextResponse.json({
      success: true,
      intakeId: result.intakeProfile.id,
      customerId: result.customer.id,
      message: 'Intake form submitted successfully.',
    });
  } catch (error: unknown) {
    logger.error('Failed to submit intake form', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
