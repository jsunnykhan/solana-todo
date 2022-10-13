use anchor_lang::prelude::*;
use anchor_spl::token;

use anchor_spl::token::{MintTo, Token};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod token_contract {
    use anchor_lang::solana_program::program::invoke;
    use mpl_token_metadata::instruction::{create_master_edition_v3, create_metadata_accounts_v2};

    use super::*;

    pub fn mint_nft(
        ctx: Context<MintNft>,
        creator_key: Pubkey,
        uri: String,
        title: String,
    ) -> Result<()> {
        msg!("initial mint nft");

        let cpi_account = MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.token_account.to_account_info(),
            authority: ctx.accounts.payer.to_account_info(),
        };

        let cpi_program = ctx.accounts.token_program.to_account_info();

        // cpi context need cpi_program and cpi_account

        let cpi_context = CpiContext::new(cpi_program, cpi_account);

        // token::mint_to takes cpi context and amount
        token::mint_to(cpi_context, 1)?;

        // mint the token now attach other metadata into this

        let account_info = vec![
            ctx.accounts.metadata.to_account_info(),
            ctx.accounts.mint.to_account_info(),
            ctx.accounts.mint_authority.to_account_info(),
            ctx.accounts.payer.to_account_info(),
            ctx.accounts.token_metadata_program.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
            ctx.accounts.rent.to_account_info(),
        ];

        let creators = vec![
            mpl_token_metadata::state::Creator {
                address: creator_key,
                share: 100,
                verified: false,
            },
            mpl_token_metadata::state::Creator {
                address: ctx.accounts.mint_authority.key(),
                share: 0,
                verified: false,
            },
        ];

        // add symbol and title(pass as argument)
        let symbol = std::string::ToString::to_string("SKS");

        // now invoke the metadata account and put into all  value

        invoke(
            &create_metadata_accounts_v2(
                ctx.accounts.token_metadata_program.key(),
                ctx.accounts.metadata.key(),
                ctx.accounts.mint.key(),
                ctx.accounts.mint_authority.key(),
                ctx.accounts.payer.key(),
                ctx.accounts.payer.key(),
                title,
                symbol,
                uri,
                Some(creators),
                1,
                true,
                false,
                None,
                None,
            ),
            account_info.as_slice(),
        )?;

        // now creating master editions

        let master_edition_infos = vec![
            ctx.accounts.master_edition.to_account_info(),
            ctx.accounts.mint.to_account_info(),
            ctx.accounts.mint_authority.to_account_info(),
            ctx.accounts.payer.to_account_info(),
            ctx.accounts.metadata.to_account_info(),
            ctx.accounts.token_metadata_program.to_account_info(),
            ctx.accounts.token_program.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
            ctx.accounts.rent.to_account_info(),
        ];

        invoke(
            &create_master_edition_v3(
                ctx.accounts.token_metadata_program.key(),
                ctx.accounts.master_edition.key(),
                ctx.accounts.mint.key(),
                ctx.accounts.payer.key(),
                ctx.accounts.mint_authority.key(),
                ctx.accounts.metadata.key(),
                ctx.accounts.payer.key(),
                Some(0),
            ),
            &master_edition_infos.as_slice(),
        )?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct MintNft<'info> {
    #[account(mut)]
    pub mint_authority: Signer<'info>,
    /// CHECK: This is not dangerous we don't read or write from this account
    #[account(mut)]
    pub mint: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
    /// CHECK: This is not dangerous we don't read or write from this account
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,
    /// CHECK: This is not dangerous we don't read or write from this account
    #[account(mut)]
    pub token_account: UncheckedAccount<'info>,
    /// CHECK: This is not dangerous we don't read or write from this account
    pub token_metadata_program: UncheckedAccount<'info>,
    /// CHECK: This is not dangerous we don't read or write from this account
    #[account(mut)]
    pub payer: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
    /// CHECK: This is not dangerous we don't read or write from this account
    pub rent: AccountInfo<'info>,
    /// CHECK: This is not dangerous we don't read or write from this account
    #[account(mut)]
    pub master_edition: UncheckedAccount<'info>,
}
