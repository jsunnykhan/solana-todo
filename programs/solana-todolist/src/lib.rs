use anchor_lang::prelude::*;

pub mod model;
pub mod constant;
pub mod state;

use crate::{ model::*};

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
}
