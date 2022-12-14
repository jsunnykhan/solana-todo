use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;

pub mod constant;
pub mod error;
pub mod model;
pub mod state;

use crate::{error::*, model::*};

declare_id!("84t3Rqf6KbdhtY9cTk1crG3H7CxB2dYkDa85S5waU3ka");

#[program]
pub mod my_program {

    use super::*;

    pub fn initialize_user(ctx: Context<InitializeUser>) -> Result<()> {
        let user_profile = &mut ctx.accounts.user_profile;

        user_profile.authority = ctx.accounts.authority.key();
        user_profile.last_todo = 0;
        user_profile.todo_count = 0;
        Ok(())
    }

    pub fn add_todo(ctx: Context<AddTodo>, _content: String) -> Result<()> {
        let todo_account = &mut ctx.accounts.todo_account;
        let user_profile = &mut ctx.accounts.user_profile;

        todo_account.authority = ctx.accounts.authority.key();
        todo_account.idx = user_profile.last_todo;
        todo_account.content = _content;
        todo_account.marked = false;

        user_profile.last_todo = user_profile.last_todo.checked_add(1).unwrap();
        user_profile.todo_count = user_profile.todo_count.checked_add(1).unwrap();

        Ok(())
    }

    pub fn mark_todo(ctx: Context<MarkTodo>, _todo_idx: u8) -> Result<()> {
        let todo_account = &mut ctx.accounts.todo_account;

        require!(!todo_account.marked, TodoError::AlreadyMarked);
        todo_account.marked = true;
        Ok(())
    }

    pub fn remove_todo(ctx: Context<RemoveTodo>, _todo_idx: u8) -> Result<()> {
        let user_profile = &mut ctx.accounts.user_profile;
        user_profile.todo_count = user_profile.todo_count.checked_sub(1).unwrap();
        Ok(())
    }

    pub fn update_todo(ctx: Context<UpdateTodo>, _todo_idx: u8, content: String) -> Result<()> {
        let todo_account = &mut ctx.accounts.todo_account;
        todo_account.content = content;

        Ok(())
    }

    pub fn send_token(ctx: Context<SolSend>, lamport: u64) -> Result<()> {
        let ix = anchor_lang::solana_program::system_instruction::transfer(
            ctx.accounts.from.key,
            ctx.accounts.to.key,
            lamport,
        );

        invoke(
            &ix,
            &[
                ctx.accounts.from.to_account_info(),
                ctx.accounts.to.to_account_info(),
            ],
        );

        Ok(())
    }
}
