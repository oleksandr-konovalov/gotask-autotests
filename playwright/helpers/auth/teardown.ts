import fs from 'fs';
import path from 'path';

// eslint-disable-next-line import/no-default-export
export default async function globalTeardown(): Promise<void> {
  const authFilePath: string = path.resolve(__dirname, '../../.auth/current_user.json');

  console.info('🧹 Global teardown is running');
  console.info(`🧹 Trying to remove: ${authFilePath}`);

  if (fs.existsSync(authFilePath)) {
    fs.unlinkSync(authFilePath);
    console.info('🧹 Auth file removed.');
  } else {
    console.warn('⚠️ Auth file does not exist.');
  }
}
