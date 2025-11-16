// Common instructions - applies to ALL games (not game-specific)

pub mod registry;
pub mod economic;
pub mod disputes;
pub mod signers;
pub mod validators;
pub mod batches;
pub mod scores;
pub mod accounts;

// Re-export everything for Anchor's #[program] macro
// Ambiguous re-exports warning is acceptable because handlers use full paths
#[allow(ambiguous_glob_reexports)]
pub use registry::*;
#[allow(ambiguous_glob_reexports)]
pub use economic::*;
#[allow(ambiguous_glob_reexports)]
pub use disputes::*;
pub use signers::*;
pub use validators::*;
pub use batches::*;
pub use scores::*;
pub use accounts::*;

