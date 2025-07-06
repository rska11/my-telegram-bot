import { Bot, Context } from 'grammy';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Тип контекста без расширений
type MyContext = Context & {
  match?: string;
};

const bot = new Bot<MyContext>(process.env.BOT_TOKEN!);

bot.command('start', async (ctx) => {
  const payload = ctx.match; // из /start token123
  const telegramId = ctx.from?.id;

  if (payload) {
    const { error } = await supabase.from('telegram_tokens').update({
      user_id: telegramId,
    }).eq('token', payload);

    if (error) {
      console.error('❌ Ошибка обновления токена:', error.message);
      return ctx.reply('Произошла ошибка при авторизации.');
    }

    ctx.reply('✅ Авторизация прошла успешно!');
  } else {
    ctx.reply('👋 Добро пожаловать в MagicPic!');
  }
});

bot.start();
