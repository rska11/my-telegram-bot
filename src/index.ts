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

  const { error } = await supabase.from('telegram_tokens').insert([
    {
      token: payload,
      user_id: ctx.from.id,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error('Ошибка сохранения:', error.message);
    return ctx.reply('⚠ Что-то пошло не так. Попробуйте позже.');
  }

  const returnUrl = 'https://magicpic-seven.vercel.app';

  return ctx.reply(
    '✅ Авторизация прошла успешно!\n\n🔁 Нажмите кнопку ниже, чтобы вернуться на сайт.',
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '🔁 Вернуться на сайт',
              url: returnUrl,
            },
          ],
        ],
      },
    }
  );
});

bot.launch();
