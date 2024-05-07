import express from 'express'
import redis from 'redis'
import { promisify } from 'util';


const app = express();
app.use(express.json())
const client = redis.createClient();
const promisifyClient = promisify(client.get).bind(client)

client.on('connect', () => {
    console.log("connected")
})
client.on('error', err => console.log('Redis Client Error', err));


const listProducts = [
    {
        id: 1,
        name: 'Suitcase 250',
        price: 50,
        stock: 4
    },
    {
        id: 2,
        name: 'Suitcase 450',
        price: 100,
        stock: 10
    },
    {
        id: 3,
        name: 'Suitcase 650',
        price: 350,
        stock: 2
    },
    {
        id: 4,
        name: 'Suitcase 1050',
        price: 550,
        stock: 5
    }
]

function getItemById(id) {
    const item = listProducts.find(item => item.id === id)
    console.log(item)
    return item
}

app.listen(1245, () => {})


app.get('/list_products', (req, res) => {
    return res.send(listProducts);
})

function reserveStockById(itemId, stock) {
    client.set(`item.${itemId}`, stock)
}

async function getCurrentReservedStockById(itemId) {
    const newStock = await promisifyClient(`item.${itemId}`);
    if (newStock)
        return parseInt(newStock);
    return 0;
}

app.get('/list_products/:itemId', async (req, res) => {
    const itemId = parseInt(req.params.itemId);
    const item = getItemById(itemId);
  
    if (!item) {
      return res.send({ status: 'Product not found' });
    }
  
    const currentQuantity = item.stock - await getCurrentReservedStockById(itemId);
    const newData = {
        itemId: item.id,
        itemName: item.name,
        price: item.price,
        initialAvailableQuantity: item.stock,
        currentQuantity
      }
      console.log(newData)
    return res.send();
});

  app.get('/reserve_product/:itemId', async (req, res) => {
    const itemId = parseInt(req.params.itemId);
    const item = getItemById(itemId);
  
    if (!item) {
      return res.json({ status: 'Product not found' });
    }
  
    const currentQuantity = item.initialAvailableQuantity - await getCurrentReservedStockById(itemId);
  
    if (currentQuantity <= 0) {
      return res.json({ status: 'Not enough stock available', itemId });
    }
  
    reserveStockById(itemId, await getCurrentReservedStockById(itemId) + 1);
    res.json({ status: 'Reservation confirmed', itemId });
  });
