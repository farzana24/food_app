import 'dotenv/config';
import { app, logger } from './app';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
