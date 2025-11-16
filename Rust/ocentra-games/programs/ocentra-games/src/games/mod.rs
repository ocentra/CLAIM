// Game-specific implementations

pub mod trait_def;
pub mod claim;
pub mod dispatcher;

pub use dispatcher::{validate_move, apply_action_state};

