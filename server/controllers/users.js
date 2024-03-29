const User = require('../models/User')
const Driver = require('../models/Driver')
const usersRouter = require('express').Router()

usersRouter.get('/', async (req, res) => {
    try {
        const users = await User.findAll()
        res.json(users)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

usersRouter.get('/drivers', async (req, res) => {
    try {
        const users = await User.findAll({
            where: {
                user_role: 'driver'
            }
        })
        res.json(users)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

usersRouter.get('/fueling', async (req, res) => {
    try {
        const users = await User.findAll({
            where: {
                user_role: 'fuelling_person'
            }
        })
        res.json(users)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

usersRouter.get('/maintenance', async (req, res) => {
    try {
        const users = await User.findAll({
            where: {
                user_role: 'maintenance_person'
            }
        })
        res.json(users)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

usersRouter.post('/', async (req, res) => {
    try {
        const { user_role, license_code, ...otherUserData } = req.body

        if (user_role === 'driver' && !license_code) {
            return res.status(400).json({ error: 'Driver license code is required for drivers' })
        }

        const newUser = await User.create({
            user_role,
            ...otherUserData
        })

        if (user_role === 'driver') {
            await Driver.create({
                user_id: newUser.user_id,
                license_code: license_code
            })
        }

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' })
    }
})


usersRouter.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({
            where: {
                email: username,
                password_hashed: password
            }
        })
        if (!user) { 
            return res.status(401).json({ error: 'User not found' })
        }
        res.status(201).json({
            userId: user.user_id,
            user_role: user.user_role,
          });
    } catch (error) {
        console.error('Error fetching user:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
  });

usersRouter.get('/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id)
        if (!user) { 
            return res.status(404).json({ error: 'User not found' })
        }
        res.status(203).json(user)
    } catch (error) {
        console.error('Error fetching user:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

usersRouter.get('/drivers/:id', async (req, res) => {
    try {
        const driver = await Driver.findOne({
            where: {
                user_id: req.params.id
            }
        })
        if (!driver) {
            return res.status(404).json({ error: 'Driver not found' })
        }
        res.status(200).json(driver)
    } catch (error) {
        console.error('Error fetching driver:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// usersRouter.put('/update/:userId', async (req, res) => {
//     const userId = req.params.userId;
//     const {
//       phone_number,
//     } = req.body;
  
//     try {
//       const updatedUser = await User.update(
//         {
//           phone_number,
//         },
//         {
//           where: { user_id: userId },
//           returning: true,
//         }
//       );
  
//       if (updatedUser[0] === 0) {
//         return res.status(404).json({ msg: 'User not found' });
//       }
  
//       const updatedUserData = updatedUser[1][0].get();
  
//       res.json(updatedUserData);
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server error');
//     }
// })

usersRouter.put('/:userId', async (req, res) => {
    const userId = req.params.userId;
    const {
        email,
        password_hashed,
        firstname,
        middlename,
        iin,
        rating, n_ratings,
        lastname,
        address,
        phone_number,
        user_role,
        license_code,
    } = req.body;

    try {
        // Construct the update object with non-null fields
        const updateObject = {
            ...(email && { email }),
            ...(password_hashed && { password_hashed }),
            ...(firstname && { firstname }),
            ...(middlename && { middlename }),
            ...(lastname && { lastname }),
            ...(address && { address }),
            ...(phone_number && { phone_number }),
        };

        // Update User
        const updatedUser = await User.update(
            updateObject,
            {
                where: { user_id: userId },
                returning: true,
            }
        );

        if (updatedUser[0] === 0) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const updatedUserData = updatedUser[1][0].get();

        // Update Driver if user_role is 'driver'
        if (user_role === 'driver') {
            const [updatedDriverRowCount] = await Driver.update(
                { license_code },
                { where: { user_id: userId } }
            );

            if (updatedDriverRowCount === 0) {
                return res.status(404).json({ msg: 'Driver not found' });
            }
        }

        res.json(updatedUserData);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});




module.exports = usersRouter