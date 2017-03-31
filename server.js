class Server{
  constructor(env){
    this.env=env;
    this.express = require('express');
    this.app = this.express();
    this.clientRouter = this.express.Router();
    this.apiRouter = this.express.Router();

    this.app.set('view engine','pug');
    this.app.set('view cache',this.env==='production');

    this.setupRouting();
    this.app.listen(8880);

    }

    setupRouting(){
      const  path=require('path');

      this.app.use('/build',this.express.static(path.join(__dirname,'build'),{
        maxAge:this.env==='production'
          ?31536000
          :0
      }));
      this.app.use('/vendor',this.express.static(path.join(__dirname,'vendor'),{
        maxAge:this.env==='production'
          ?31536000
          :0
      }));


      this.clientRouter.get('/',(req,res,next)=>{
        res.render('index',{
          pageTitle:'Главная страница'
        });
      });

      this.apiRouter.get('/',(req,res,next)=>{
        res.json({
          "message":"Hello from API!"
        })
      });
      this.app.use('/api',this.apiRouter);
      this.app.use('/',this.clientRouter);
    }
}
new Server(process.env.NODE_ENV||'development');
