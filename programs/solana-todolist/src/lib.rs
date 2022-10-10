use anchor_lang::prelude::*;


pub mod constant;
pub mod error;
pub mod model;
pub mod state;

use crate::{error::*, model::*};

declare_id!("84t3Rqf6KbdhtY9cTk1crG3H7CxB2dYkDa85S5waU3ka");

#[program]
pub mod nft_program {

    use super::*;

    pub fn initialize_user(ctx: Context<InitializeUser>) -> Result<()> {
        let user_profile = &mut ctx.accounts.user_profile;

        user_profile.authority = ctx.accounts.authority.key();
        user_profile.last_todo = 0;
        user_profile.todo_count = 0;
        Ok(())
    }

    
}
