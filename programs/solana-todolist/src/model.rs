use anchor_lang::prelude::*;

use crate::{constant::*, state::*};


#[derive(Accounts)]
#[instruction()]
pub struct AssosiatedTokenAccount<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(init , payer=owner , seeds = [b"mint"] , bump ,space= 8 + std::mem::size_of::<MintAccount>(),)]
    pub mint_account: Box<Account<'info, MintAccount>>,
    #[account(
        init,
        seeds= [owner.key().as_ref() , mint_account.key().as_ref() , program_id.key().as_ref()],
        bump,
        payer=owner,
        space= 8 + std::mem::size_of::<MintAccount>(),
    )]
    pub mint: Box<Account<'info, MintAccount>>,
    pub system_program: Program<'info, System>,
}
