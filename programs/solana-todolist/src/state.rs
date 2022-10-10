use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct MintAccount {
    pub mint_authority: Pubkey,
    pub supply: u8,
    pub decimals: u8,
    is_initialized: bool,
    freeze_authority: Pubkey,
}

#[account]
#[derive(Default)]
pub struct TokenAccount {
    pub mint: Pubkey,
    pub owner: Pubkey,
    pub amount: u8,
    pub delegate: bool,
    pub state : State
}

pub enum  State {
    Fungible,
    Non_Fungible
}