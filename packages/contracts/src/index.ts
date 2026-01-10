/**
 * @tbwa/contracts
 *
 * Shared contracts between CES (Palette Forge) and Scout (Agency Databank)
 *
 * Usage:
 *   import { Campaign, Asset, Score } from '@tbwa/contracts';
 *   import { Transaction, Attribution } from '@tbwa/contracts/scout';
 *   import { AssetFeature, Recommendation } from '@tbwa/contracts/ces';
 */

// Re-export all shared types
export * from './shared';

// Re-export CES types
export * from './ces';

// Re-export Scout types (for reference/alignment)
export * from './scout';
