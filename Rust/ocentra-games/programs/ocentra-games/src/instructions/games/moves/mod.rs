pub mod submit_move;
pub mod submit_batch_moves;

// Re-export for Anchor's #[program] macro
// Ambiguous re-exports warning is acceptable because handlers use full paths
#[allow(ambiguous_glob_reexports)]
pub use submit_move::*;
pub use submit_batch_moves::*;

