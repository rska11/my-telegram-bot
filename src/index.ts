import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN as string);

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

bot.start(async (ctx) => {
  const payload = ctx.startPayload;

  if (!payload) {
    return ctx.reply('❌ Токен не найден. Пожалуйста, используйте правильную ссылку.');
  }

  const { error } = await supabase.from('telegram_tokens').upsert(
    [
      {
        token: payload,
        user_id: ctx.from.id,
        created_at: new Date().toISOString(),
      },
    ],
    { onConflict: 'user_id' } // исправлено: строка вместо массива
  );

  if (error) {
    console.error('Ошибка сохранения:', error.message);
    return ctx.reply('⚠ Что-то пошло не так. Попробуйте позже.');
  }

  return ctx.reply('✅ Добро пожаловать! Токен принят.');
});

bot.launch();
