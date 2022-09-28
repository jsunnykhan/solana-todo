use anchor_lang::prelude::*;

#[error_code]
pub enum TodoError {
    #[msg("Already Marked")]
    AlreadyMarked,
}
