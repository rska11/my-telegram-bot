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

  // 1. Ищем токен в базе
  const { data: existingToken, error: checkError } = await supabase
    .from('telegram_tokens')
    .select('*')
    .eq('token', payload)
    .maybeSingle();

  if (checkError) {
    console.error('Ошибка при проверке токена:', checkError.message);
    return ctx.reply('⚠ Что-то пошло не так при проверке токена.');
  }

  // 2. Если токен не найден — неправильная ссылка
  if (!existingToken) {
    return ctx.reply('❌ Токен не найден. Используйте свежую ссылку для входа.');
  }

  // 3. Если токен уже использован — авторизация не разрешается
  if (existingToken.user_id) {
    return ctx.reply('⚠ Этот токен уже использован. Пожалуйста, сгенерируйте новый.');
  }

  // 4. Обновляем токен — сохраняем user_id (этого достаточно!)
  const { error: updateError } = await supabase
    .from('telegram_tokens')
    .update({
      user_id: ctx.from.id,
    })
    .eq('token', payload);

  if (updateError) {
    console.error('Ошибка при обновлении токена:', updateError.message);
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
