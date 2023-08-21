Pertama-tama, tim backend meminta maaf karena memakan terlalu banyak waktu.

Di file ini, kami akan menjelaskan secara singkat apa files yang ada di dalam.

app.js = file utama
package.json = versi, dependencies, dll
package-lock.json = sama aja tapi lebih detail
rest.http = simulasi
.env = menyimpan variabel-variabel yang tidak boleh diakses sembarang orang

routes:
authRoute.js = berisi rute-rute seperti login, logout, register

controlles:
authController.js = berisi kodingan dari authRoute

helpers:
generateKeys.js = untuk membuat access token dan refresh token semisal terkena hack, keduanya ditaruh di file .env
initMongoDB = initialize Mongo DB
initRedis = initialize redis, untuk refresh token dan logout
jwtHelper = untuk JWT
validationSchema = untuk struktur email dan password

models:
userModels.js = untuk struktur email dan password dan hash password

node modules: jangan disentuh, itu kodingan dependencies
