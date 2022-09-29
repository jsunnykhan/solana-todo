
use anchor_lang::prelude::*;

use crate::{constant::*, state::*};



#[derive(Accounts)]
#[instruction()]
pub struct InitializeUser<'info> {
    
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init,
        seeds= [USER_TAG,authority.key().as_ref()],
        bump,
        payer=authority,
        space=8 + std::mem::size_of::<UserProfile>(),
    )]
    pub user_profile: Box<Account<'info, UserProfile>>,
    pub system_program: Program<'info , System>
    
}

#[derive(Accounts)]
#[instruction()]
pub struct AddTodo<'info>{

    #[account(
        mut,
        seeds= [USER_TAG,authority.key().as_ref()],
        bump,
        has_one = authority,
    )]
    pub user_profile: Box<Account<'info, UserProfile>>,

    #[account(
        init , 
        seeds = [TODO_TAG , authority.key().as_ref(),&[user_profile.last_todo as u8].as_ref()] ,
        bump,
        payer = authority,
        space = 8 + std::mem::size_of::<TodoAccount>(),
    )]
    pub todo_account: Box<Account<'info, TodoAccount>>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program : Program<'info , System>
}

#[derive(Accounts)]
#[instruction(_todo_idx:u8)]
pub struct  MarkTodo<'info>{
    #[account(
        mut , 
        seeds=[USER_TAG, authority.key().as_ref()],
        bump ,
        has_one=authority
    )]
    pub user_profile : Box<Account<'info , UserProfile>>,
    #[account(
        mut , 
        seeds = [TODO_TAG , authority.key().as_ref(),&[_todo_idx].as_ref()] ,
        bump,
        has_one=authority
    )]
    pub todo_account : Box<Account<'info , TodoAccount>>,
    #[account(mut)]
    pub authority : Signer<'info>,
    pub system_program: Program<'info , System>

}

#[derive(Accounts)]
#[instruction(_todo_idx:u8)] 
pub struct RemoveTodo<'info> {
    #[account(
        mut,
        seeds = [USER_TAG, authority.key().as_ref()],
        bump,
        has_one=authority
    )]
    pub user_profile:Box<Account<'info , UserProfile>>,
    #[account(
        mut,
        close =authority,
        seeds=[TODO_TAG , authority.key().as_ref(),&[_todo_idx].as_ref()],
        bump,
        has_one=authority
    )]
    pub todo_account : Box<Account<'info , TodoAccount>>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program : Program<'info , System>

}


#[derive(Accounts)]
#[instruction(_todo_idx:u8)]
pub struct UpdateTodo <'info>{
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        mut,
        seeds=[TODO_TAG,authority.key().as_ref(),&[_todo_idx].as_ref()],
        bump,
        has_one = authority
    )]
    pub todo_account : Box<Account<'info , TodoAccount>>,

    pub system_program : Program<'info , System>
}
