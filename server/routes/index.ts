import { Router } from 'express';
import { authRoute } from './auth';
import { userRoute } from './users';


const router = Router()

router.use('/api/auth', authRoute)
router.use('/api/user', userRoute)

export default router