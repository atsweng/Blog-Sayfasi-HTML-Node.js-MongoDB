const path = require('path') //path paketi import edildi
const express = require('express') //express paketi  import edildi
const exphbs = require('express-handlebars') //express-handlebars paketi import edildi
const app = express()  //express kütüphanesi oluşturuldu
const port = 3000  //hangi port kullanılacağı belirtildi
const hostname = '127.0.0.1' //hostname değişkeni atandı
const mongoose = require('mongoose') //mongoose paketi import edildi
var bodyParser = require('body-parser') //body-parser paketi import edildi
const fileUpload = require('express-fileupload') //express-fileupload paketi import edildi
const {generateDate, limit, truncate, paginate} = require('./helpers/hbs') //oluşturulan helpers dosyası import edildi
const expressSession = require('express-session') //express-session paketi import edildi
const connectMongo = require('connect-mongo') //connect-mongo paketi import edildi
var methodOverride = require('method-override') //method-override paketi import edildi

//db bağlantısı
mongoose.connect('mongodb://127.0.0.1/proje_db', {
    useNewUrlParser: true,
   // useCreateIndex: true,
    useUnifiedTopology: true,
}).then(() => console.log("Veritabanı bağlantısı başarıyla sağlandı."))
.catch((error) => console.log("Veritabanı bağlantısı sağlanırken beklenmeyen bir hatayla karşılaşıldı.", error.message));

//sessions database kayıt etme
const mongoStore = connectMongo(expressSession)

app.use(expressSession({
    secret: 'testotesto',
    resave: false,
    saveUninitialized: true,
    store: new mongoStore({ mongooseConnection: mongoose.connection })
}))



app.use(fileUpload()) //fileupload paketini kullanmayı sağlar
app.use(express.static('public')) //public dosyasına erişmeyi sağlar
app.use(methodOverride('_method')) //method-override paketini kullanmayı sağlar

//handlebars helpers
const hbs= exphbs.create({
    helpers:{
        generateDate:generateDate,
        limit:limit,
        truncate:truncate,
        paginate:paginate
    }
})

app.engine('handlebars',hbs.engine ); //handlebars engine'i kullanıldı
app.set('view engine', 'handlebars');

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))
// parse application/json
app.use(express.json())

//display link middleware
app.use((req, res, next) => {
    const { userId } = req.session
    if (userId) {
        res.locals = {
            displayLink: true
        }
    }
    else {
        res.locals = {
            displayLink: false
        }
    }
    next()
})

//Flash Message middleware
app.use((req, res, next) => {
    res.locals.sessionFlash = req.session.sessionFlash
    delete req.session.sessionFlash
    next()
})

const main = require('./routes/main') //routes klasöründen main dosyasını require ediyor
const posts = require('./routes/posts') //routes klasöründen posts dosyasını require ediyor
const users = require('./routes/users') //routes klasöründen users dosyasını require ediyor
const admin = require('./routes/admin/index') //routes klasöründen admin kalsöründeki index dosyasını require ediyor
const contact = require('./routes/contact') //routes klasöründen contact dosyasını require ediyor
const MongoStore = require('connect-mongo')


//middlewire kullanıyoruz
app.use('/', main) //anasayfaya yönlendiriliyor
app.use('/posts', posts) //post sayfasına yönlendiriliyor
app.use('/users', users) //kullanıcı sayfasına yönlendiriliyor
app.use('/admin', admin) //admin sayfasına yönlendiriliyor
app.use('/contact', contact) //iletişim sayfasına yönlendiriliyor

app.listen(port, hostname, () => {
    console.log(`Server Çalışıyor, http://${hostname}:${port}/`)
}) //server çalıştırılıyor


