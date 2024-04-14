import users from "../db/users.json" assert {type: "json"};

import orders from "../db/orders.json" assert {type: "json"};

import menu from "../db/menu.json" assert {type: "json"};


import fs from 'fs';

import path, { dirname } from "path";


import { fileURLToPath } from 'url';


const __dirname = dirname(fileURLToPath(import.meta.url));

const userController = {

    createUser: async (req, res) => {
        try {
            const newUser = {
                ...req.body,
                orders: []
            }
    
            users.push(newUser);
            users.forEach((user, index) => {
                user.id = index + 1;
            });
    
            await fs.promises.writeFile(path.join(__dirname, '../db/users.json'), JSON.stringify(users, null, 2))
    
            res.status(201).json(newUser)
    
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'An error occurred while creating user.' })
        }
    },

    getUsers: (req, res) => {
        try {
    if(req.query.paginate === 'true') {
   
    res.status(200).json(paginatedUser);
    
    } else {
        res.status(200).json(users)
    }
        } catch (error) {
            res.status(500).json({ message: 'An error occurred while retrieving users.' })
        }
    },

    getUserById: (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const user = users.find(user => user.id === id)
    
            if (!user) {
                res.status(404).json({ message: 'User not found.' });
                return;
            }
    
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json({ message: 'An error occurred while retrieving the user by id.' })
        }
    },

    updateUser: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const updateUser = { ...req.body, id };
    
            let userIndex = users.findIndex(user => user.id === id);
    
            if (userIndex === -1) {
                res.status(404).json({ message: 'User not found.' });
            }

           
            updateUser.orders = users[userIndex].orders;
    
            users[userIndex] = updateUser;
    
            
            await fs.promises.writeFile(path.join(__dirname, '../db/users.json'), JSON.stringify(users, null, 2));
            res.status(200).json(updateUser);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'An error occurred while updating the user' })
        }
    },

    deleteUser:async (req, res) => {
        try {
            const id = parseInt(req.params.id);
    
            let userIndex = users.findIndex(user => user.id === id);
        
                if (userIndex === -1) {
                    res.status(404).json({ message: 'User not found.' });
                    return;
                }
    
                users.splice(userIndex, 1)
    
                await fs.promises.writeFile(path.join(__dirname, '../db/users.json'), JSON.stringify(users, null, 2));
                res.status(200).json({message: "User successfully deleted."});
    
        } catch (error) {
            console.error(error);
                res.status(500).json({ message: 'An error occurred while deleting the user' })
        }
        },

        createOrderUser: async (req, res) => {
            try {
                const userId = Number(req.params.userId);
                const menuItemId = Number(req.query.menuItemId);
                const quantity = Number(req.query.quantity);
    
                const user = users.find(user => user.id === userId);
    
                if (!user) {
                    res.status(404).json({ message: 'User not found.' });
                    return;
                }
    
                let maxOrderId;
                if (orders.length > 0) {
                    maxOrderId = Math.max(...orders.map(order => order.id));
                } else {
                    maxOrderId = 0;
                }
    
             
                const orderToSave = {
                    id: maxOrderId + 1, 
                    Items: []
                }
    
                const menuItem = menu.find(menus => menus.id === menuItemId);
    
                if (!menuItem) {
                    res.status(400).json({ message: 'Menu item with ID you written does not exist' });
                    return;
                }
    
                orderToSave.Items.push({
                    menuItemId: menuItemId,
                    quantity: quantity
                });
    
                orders.push(orderToSave);
    
                user.orders.push(orderToSave.id);
    
                await fs.promises.writeFile(path.join(__dirname, '../db/orders.json'), JSON.stringify(orders, null, 2));
        
                await fs.promises.writeFile(path.join(__dirname, '../db/users.json'), JSON.stringify(users, null, 2));
    
                res.status(201).json(orderToSave)
            } catch (error) {
                console.log(error);
                res.status(500).json({ message: 'An error occurred while creating the order.' })
            }
        },

        login: async (req, res) => {
            try {
                const {name, password, email} = req.body;

                const user = users.find(user => user.name === name ||  user.email === email);
                
                if(!user) {
                    res.status(404).json({ message: 'User nor found'});
                    return;
                }

                if (user.password !== password) {
                    res.status(401).json({ message: 'Invalid password'});
                    return;
                }

                req.session.userId = user.id;
                
                res.status(200).json({ message: 'User Logged in succssesfully'});

            } catch (error) {
                res.status(500).json({ message: 'An error occurred while logging in' })
            }
        },

        logout: (req, res) => {

            try {
             
             if (!req.session.userId) {

                 res.status(400).json({ message: 'No active session.'});
                 return;
             }
                 req.session.destroy(err => {
                     if (err) {
                         res.status(500).json({ message: 'An error occurred while logging out'});
                         return;
                     }
                 })

                 res.status(200).json({message: 'Logged out successfully.' })

             

            } catch (error) {
             res.status(500).json({ message: 'An error occurred while logging out' })
            }     
         }

}

export default userController;