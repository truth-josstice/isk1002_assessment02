# Successful Deployment Log

2025-08-23T07:57:01.501909363Z Using cached blinker-1.9.0-py3-none-any.whl (8.5 kB)
2025-08-23T07:57:01.503129355Z Using cached click-8.2.1-py3-none-any.whl (102 kB)
2025-08-23T07:57:01.504389119Z Using cached flask-3.1.1-py3-none-any.whl (103 kB)
2025-08-23T07:57:01.505632582Z Using cached Flask_Bcrypt-1.0.1-py3-none-any.whl (6.0 kB)
2025-08-23T07:57:01.506781973Z Using cached Flask_JWT_Extended-4.7.1-py2.py3-none-any.whl (22 kB)
2025-08-23T07:57:01.507911834Z Using cached PyJWT-2.10.1-py3-none-any.whl (22 kB)
2025-08-23T07:57:01.509041724Z Using cached flask_sqlalchemy-3.1.1-py3-none-any.whl (25 kB)
2025-08-23T07:57:01.510196255Z Using cached greenlet-3.2.3-cp313-cp313-manylinux_2_24_x86_64.manylinux_2_28_x86_64.whl (608 kB)
2025-08-23T07:57:01.511918411Z Using cached gunicorn-23.0.0-py3-none-any.whl (85 kB)
2025-08-23T07:57:01.513124203Z Using cached iniconfig-2.1.0-py3-none-any.whl (6.0 kB)
2025-08-23T07:57:01.514244393Z Using cached itsdangerous-2.2.0-py3-none-any.whl (16 kB)
2025-08-23T07:57:01.515370663Z Using cached jinja2-3.1.6-py3-none-any.whl (134 kB)
2025-08-23T07:57:01.516631067Z Using cached MarkupSafe-3.0.2-cp313-cp313-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (23 kB)
2025-08-23T07:57:01.517753077Z Using cached marshmallow-4.0.0-py3-none-any.whl (48 kB)
2025-08-23T07:57:01.518919538Z Using cached marshmallow_sqlalchemy-1.4.2-py3-none-any.whl (16 kB)
2025-08-23T07:57:01.520044818Z Using cached sqlalchemy-2.0.41-cp313-cp313-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (3.2 MB)
2025-08-23T07:57:01.523729037Z Using cached packaging-25.0-py3-none-any.whl (66 kB)
2025-08-23T07:57:01.524914989Z Using cached pluggy-1.6.0-py3-none-any.whl (20 kB)
2025-08-23T07:57:01.526062439Z Using cached psycopg2_binary-2.9.10-cp313-cp313-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (3.0 MB)
2025-08-23T07:57:01.529580494Z Using cached pygments-2.19.2-py3-none-any.whl (1.2 MB)
2025-08-23T07:57:01.531630928Z Using cached pytest-8.4.1-py3-none-any.whl (365 kB)
2025-08-23T07:57:01.533033056Z Using cached python_dotenv-1.1.1-py3-none-any.whl (20 kB)
2025-08-23T07:57:01.534164926Z Using cached typing_extensions-4.14.1-py3-none-any.whl (43 kB)
2025-08-23T07:57:01.535309507Z Using cached werkzeug-3.1.3-py3-none-any.whl (224 kB)
2025-08-23T07:57:01.60642462Z Installing collected packages: typing_extensions, python-dotenv, PyJWT, Pygments, psycopg2-binary, pluggy, packaging, marshmallow, MarkupSafe, itsdangerous, iniconfig, greenlet, click, blinker, bcrypt, Werkzeug, SQLAlchemy, pytest, Jinja2, gunicorn, marshmallow-sqlalchemy, Flask, Flask-SQLAlchemy, Flask-JWT-Extended, Flask-Bcrypt
2025-08-23T07:57:05.88249394Z 
2025-08-23T07:57:05.885894001Z Successfully installed Flask-3.1.1 Flask-Bcrypt-1.0.1 Flask-JWT-Extended-4.7.1 Flask-SQLAlchemy-3.1.1 Jinja2-3.1.6 MarkupSafe-3.0.2 PyJWT-2.10.1 Pygments-2.19.2 SQLAlchemy-2.0.41 Werkzeug-3.1.3 bcrypt-4.3.0 blinker-1.9.0 click-8.2.1 greenlet-3.2.3 gunicorn-23.0.0 iniconfig-2.1.0 itsdangerous-2.2.0 marshmallow-4.0.0 marshmallow-sqlalchemy-1.4.2 packaging-25.0 pluggy-1.6.0 psycopg2-binary-2.9.10 pytest-8.4.1 python-dotenv-1.1.1 typing_extensions-4.14.1
2025-08-23T07:57:05.892394675Z 
2025-08-23T07:57:05.892404745Z [notice] A new release of pip is available: 25.1.1 -> 25.2
2025-08-23T07:57:05.892407995Z [notice] To update, run: pip install --upgrade pip
2025-08-23T07:57:06.790899826Z ==> Uploading build...
2025-08-23T07:57:17.245595281Z ==> Uploaded in 9.2s. Compression took 1.2s
2025-08-23T07:57:17.261680942Z ==> Build successful 🎉
2025-08-23T07:57:20.158731373Z ==> Deploying...
2025-08-23T07:57:34.625479031Z ==> Running 'gunicorn 'main:create_app()''
2025-08-23T07:57:47.029055303Z [2025-08-23 07:57:47 +0000] [67] [INFO] Starting gunicorn 23.0.0
2025-08-23T07:57:47.029474093Z [2025-08-23 07:57:47 +0000] [67] [INFO] Listening at: http://0.0.0.0:10000 (67)
2025-08-23T07:57:47.029608946Z [2025-08-23 07:57:47 +0000] [67] [INFO] Using worker: sync
2025-08-23T07:57:47.12005181Z [2025-08-23 07:57:47 +0000] [69] [INFO] Booting worker with pid: 69
2025-08-23T07:57:47.222852554Z 127.0.0.1 - - [23/Aug/2025:07:57:47 +0000] "HEAD / HTTP/1.1" 200 0 "-" "Go-http-client/1.1"
2025-08-23T07:57:50.875929103Z ==> Your service is live 🎉
2025-08-23T07:57:51.068693228Z ==> 
2025-08-23T07:57:51.098561344Z ==> ///////////////////////////////////////////////////////////
2025-08-23T07:57:51.1253781Z ==> 
2025-08-23T07:57:51.153389006Z ==> Available at your primary URL https://climbing-tracker-of-truth-and-josstice.onrender.com
2025-08-23T07:57:51.181802043Z ==> 
2025-08-23T07:57:51.212358238Z ==> ///////////////////////////////////////////////////////////
2025-08-23T07:57:52.488589845Z 127.0.0.1 - - [23/Aug/2025:07:57:52 +0000] "GET / HTTP/1.1" 200 1247 "-" "Go-http-client/2.0"
2025-08-23T07:58:04.758367183Z 127.0.0.1 - - [23/Aug/2025:07:58:04 +0000] "GET / HTTP/1.1" 200 1247 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:141.0) Gecko/20100101 Firefox/141.0"
2025-08-23T07:58:10.215042051Z 127.0.0.1 - - [23/Aug/2025:07:58:10 +0000] "GET /health HTTP/1.1" 404 36 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:141.0) Gecko/20100101 Firefox/141.0"
2025-08-23T07:58:26.993355902Z 127.0.0.1 - - [23/Aug/2025:07:58:26 +0000] "GET / HTTP/1.1" 200 1247 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:141.0) Gecko/20100101 Firefox/141.0"
2025-08-23T07:58:44.939007428Z 127.0.0.1 - - [23/Aug/2025:07:58:44 +0000] "GET /about-api HTTP/1.1" 404 36 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:141.0) Gecko/20100101 Firefox/141.0"
2025-08-23T07:58:45.160933202Z 127.0.0.1 - - [23/Aug/2025:07:58:45 +0000] "GET /favicon.ico HTTP/1.1" 404 36 "https://climbing-tracker-of-truth-and-josstice.onrender.com/about-api" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:141.0) Gecko/20100101 Firefox/141.0"
2025-08-23T07:58:50.159004735Z 127.0.0.1 - - [23/Aug/2025:07:58:50 +0000] "GET /about-api/ HTTP/1.1" 404 36 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:141.0) Gecko/20100101 Firefox/141.0"
2025-08-23T07:58:50.379251308Z 127.0.0.1 - - [23/Aug/2025:07:58:50 +0000] "GET /favicon.ico HTTP/1.1" 404 36 "https://climbing-tracker-of-truth-and-josstice.onrender.com/about-api/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:141.0) Gecko/20100101 Firefox/141.0"
2025-08-23T07:59:02.407157216Z 127.0.0.1 - - [23/Aug/2025:07:59:02 +0000] "GET /learn/about-api/ HTTP/1.1" 200 154 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:141.0) Gecko/20100101 Firefox/141.0"
2025-08-23T07:59:02.647425185Z 127.0.0.1 - - [23/Aug/2025:07:59:02 +0000] "GET /favicon.ico HTTP/1.1" 404 36 "https://climbing-tracker-of-truth-and-josstice.onrender.com/learn/about-api/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:141.0) Gecko/20100101 Firefox/141.0"
2025-08-23T07:59:15.029848932Z 127.0.0.1 - - [23/Aug/2025:07:59:15 +0000] "GET / HTTP/1.1" 200 1247 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:141.0) Gecko/20100101 Firefox/141.0"
2025-08-23T07:59:15.259181017Z 127.0.0.1 - - [23/Aug/2025:07:59:15 +0000] "GET /favicon.ico HTTP/1.1" 404 36 "https://climbing-tracker-of-truth-and-josstice.onrender.com/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:141.0) Gecko/20100101 Firefox/141.0"