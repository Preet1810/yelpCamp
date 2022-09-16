const mongoose=require('mongoose');
const Review=require('./review');
const Schema=mongoose.Schema;

// https://res.cloudinary.com/douqbebwk/image/upload/w_300/v1600113904/YelpCamp/gxgle1ovzd2f3dgcpass.png
// https://res.cloudinary.com/dwh4llt0c/image/upload/v1662981947/YelpCamp/gmqh5tltadlh35cwjp0x.jpg


const ImageSchema=new Schema({
    url: String,
    filename: String,
    fileSize: Number
});                                                                    //we are doing all this for the images to be seen in 300px on edit page

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts={ toJSON: { virtuals: true } }; //important to do this while using virtual schema

const CampgroundSchema=new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author:
    {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]


}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`

});

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {                                                           //Middleware
                $in: doc.reviews
            }
        })
    }
})


module.exports=mongoose.model('Campground', CampgroundSchema);


