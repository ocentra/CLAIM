pub mod daily_login;
pub mod game_payment;
pub mod ad_reward;
pub mod pro_subscription;
pub mod ai_credit_purchase;
pub mod ai_credit_consume;

// Re-export for Anchor's #[program] macro
// Ambiguous re-exports warning is acceptable because handlers use full paths
#[allow(ambiguous_glob_reexports)]
pub use daily_login::*;
#[allow(ambiguous_glob_reexports)]
pub use game_payment::*;
#[allow(ambiguous_glob_reexports)]
pub use ad_reward::*;
#[allow(ambiguous_glob_reexports)]
pub use pro_subscription::*;
#[allow(ambiguous_glob_reexports)]
pub use ai_credit_purchase::*;
pub use ai_credit_consume::*;

