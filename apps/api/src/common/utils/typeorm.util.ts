import { BadRequestException, ConflictException } from '@nestjs/common';
import { EntityManager, EntityTarget, In, QueryFailedError } from 'typeorm';

/** Throws BadRequestException if any of the given ids don't exist for the entity. */
export async function assertEntitiesExist<T extends { id: string }>(
  manager: EntityManager,
  entity: EntityTarget<T>,
  ids: string[],
  label: string,
): Promise<void> {
  const uniqueIds = [...new Set(ids)];
  const found = await manager.findBy(entity, {
    id: In(uniqueIds),
  } as Parameters<typeof manager.findBy<T>>[1]);
  if (found.length !== uniqueIds.length) {
    throw new BadRequestException(`One or more ${label} not found`);
  }
}

/** Saves the entity, converting unique/FK violations into a ConflictException. */
export async function saveOrThrowConflict<T extends { id: string }>(
  manager: EntityManager,
  entity: T,
  conflictMessage: string,
): Promise<T> {
  try {
    return await manager.save(entity);
  } catch (error) {
    if (error instanceof QueryFailedError) {
      throw new ConflictException(conflictMessage);
    }
    throw error;
  }
}
