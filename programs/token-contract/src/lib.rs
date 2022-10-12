pub mod ata;

use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token;

use anchor_spl::token::{MintTo, Token, Transfer};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod token_contract {
    use super::*;

    pub fn mint_token(ctx: Context<MintToken>, amount: u64) -> Result<()> {
        let cpi_account = MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.token_account.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };

        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_account);

        token::mint_to(cpi_ctx, amount)?;
        Ok(())
    }

    pub fn transfer_token(ctx: Context<TransferToken>, amount: u64) -> Result<()> {
        let transfer_instruction = Transfer {
            from: ctx.accounts.from.to_account_info(),
            to: ctx.accounts.to.to_account_info(),
            authority: ctx.accounts.from_authority.to_account_info(),
        };

        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, transfer_instruction);
        token::transfer(cpi_ctx, amount)?;

        Ok(())
    }

    pub fn create_ata(ctx: Context<ATA>) -> Result<(Pubkey, u8)> {
        Ok(Pubkey::find_program_address(
            &[
                &ctx.accounts.wallet.key().to_bytes(),
                &ctx.accounts.token_mint_address.key().to_bytes(),
                &ctx.accounts.token_program_id.key().to_bytes(),
            ],
            &ctx.accounts.program_id.key(),
        ))
    }
}

#[derive(Accounts)]
pub struct ATA<'info> {
    #[account(mut)]
    pub wallet: AccountInfo<'info>,
    #[account(mut)]
    pub token_mint_address: UncheckedAccount<'info>,
    pub token_program_id: Program<'info, Token>,
    pub program_id: Program<'info, AssociatedToken>,
}

#[derive(Accounts)]
pub struct MintToken<'info> {
    /// CHECK: This is the token that we want to mint
    #[account(mut)]
    pub mint: UncheckedAccount<'info>,
    pub token_program: Program<'info, Token>,
    /// CHECK: This is the token account that we want to mint tokens to
    #[account(mut)]
    pub token_account: UncheckedAccount<'info>,
    /// CHECK: the authority of the mint account
    #[account(mut)]
    pub authority: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct TransferToken<'info> {
    pub token_program: Program<'info, Token>,
    /// CHECK: The associated token account that we are transferring the token from
    #[account(mut)]
    pub from: UncheckedAccount<'info>,
    /// CHECK: The associated token account that we are transferring the token to
    #[account(mut)]
    pub to: AccountInfo<'info>,
    // the authority of the from account
    pub from_authority: Signer<'info>,
}
