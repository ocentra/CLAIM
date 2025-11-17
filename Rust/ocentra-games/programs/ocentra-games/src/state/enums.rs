/// Match type constants (replaces enum to reduce program size)
pub mod match_type {
    pub const FREE: u8 = 0;
    pub const PAID: u8 = 1;
}

/// Payment method constants (replaces enum to reduce program size)
pub mod payment_method {
    pub const WALLET: u8 = 0; // Direct wallet payment (SOL from user's wallet)
    pub const PLATFORM: u8 = 1; // Platform deposit payment (SOL from user's deposit account)
}

/// KYC/Custody tier constants
pub mod kyc_tier {
    pub const NONE: u8 = 0; // No KYC required
    pub const BASIC: u8 = 1; // Basic KYC (email verification)
    pub const ENHANCED: u8 = 2; // Enhanced KYC (ID verification)
    pub const INSTITUTIONAL: u8 = 3; // Institutional (full compliance)
}
