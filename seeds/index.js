const mongoose=require('mongoose');
const cities=require('./cities');
const { places, descriptors }=require('./seedHelpers');
const Campground=require('../models/campground');
const indianCities=require('./indiCites');

if (process.env.NODE_ENV!=='production') {
    require('dotenv').config();
}

const dbUrl=process.env.DB_URL||'mongodb://localhost:27017/yelp-camp'

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db=mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample=array => array[Math.floor(Math.random()*array.length)];


const seedDB=async () => {
    await Campground.deleteMany({});
    //     for (let i=0; i<300; i++) {
    //         const random1000=Math.floor(Math.random()*199);
    //         const price=Math.floor(Math.random()*20)+10;
    //         const camp=new Campground({
    //             author: '632462efa0d2a9f5352e7232',
    //             location: `${indianCities[random1000].name}, ${indianCities[random1000].state}`,
    //             title: `${sample(descriptors)} ${sample(places)}`,
    //             description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur assumenda dolorem laudantium ipsa quasi officia vel a placeat eum eveniet. Nihil sit velit numquam eius architecto inventore doloribus, esse exercitationem.Officia officiis alias vel error voluptatem veniam fuga, adipisci, ratione culpa dolore animi ipsam beatae rerum quam nobis ullam laudantium possimus! Deleniti incidunt atque voluptates autem a commodi qui et.',
    //             price,
    //             geometry: {
    //                 type: "Point",
    //                 coordinates: [
    //                     indianCities[random1000].lon,
    //                     indianCities[random1000].lat
    //                 ]
    //             },
    //             images: [
    //                 {
    //                     url: 'https://res.cloudinary.com/dwh4llt0c/image/upload/v1663355981/YelpCamp/lj73w8h2k5sq01dja586.jpg',
    //                     filename: 'YelpCamp/lj73w8h2k5sq01dja586',
    //                     fileSize: 55140,

    //                 },
    //                 {
    //                     url: 'https://res.cloudinary.com/dwh4llt0c/image/upload/v1663355981/YelpCamp/jnzg6txqa1gc2bqvx4fs.jpg',
    //                     filename: 'YelpCamp/jnzg6txqa1gc2bqvx4fs',
    //                     fileSize: 94296,

    //                 },
    //                 {
    //                     url: 'https://res.cloudinary.com/dwh4llt0c/image/upload/v1663355981/YelpCamp/t58kxc5muhhpjp1tyewj.jpg',
    //                     filename: 'YelpCamp/t58kxc5muhhpjp1tyewj',
    //                     fileSize: 46683,

    //                 }
    //             ],
    //         })
    //         await camp.save();
    //     }
}

seedDB().then(() => {
    mongoose.connection.close();
})

