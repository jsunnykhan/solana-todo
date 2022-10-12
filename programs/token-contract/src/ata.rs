use anchor_lang::prelude::*;

declare_id!("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");

pub fn create_ata(
    wallet_address: &Pubkey,
    token_mint_address: &Pubkey,
    token_program_id: &Pubkey,
) -> Result<(Pubkey, u8)> {
    Ok(Pubkey::find_program_address(
        &[
            &wallet_address.to_bytes(),
            &token_mint_address.to_bytes(),
            &token_program_id.to_bytes(),
        ],
&id(),
    ))
}
