pub mod ad_reward;
pub mod ai_credit_consume;
pub mod ai_credit_purchase;
pub mod daily_login;
pub mod game_payment;
pub mod pro_subscription;

// Re-export for Anchor's #[program] macro
// Ambiguous re-exports warning is acceptable because handlers use full paths
#[allow(ambiguous_glob_reexports)]
pub use ad_reward::*;
pub use ai_credit_consume::*;
#[allow(ambiguous_glob_reexports)]
pub use ai_credit_purchase::*;
#[allow(ambiguous_glob_reexports)]
pub use daily_login::*;
#[allow(ambiguous_glob_reexports)]
pub use game_payment::*;
#[allow(ambiguous_glob_reexports)]
pub use pro_subscription::*;
