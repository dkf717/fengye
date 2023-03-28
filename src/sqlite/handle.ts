import sq3 from "sqlite3";
import fs from "fs"
import path from "path"
import * as process from "process"
const sqlitePath = path.join( process.env.CUSTOM_DOCUMENTS_PATH as string,'FengyeData')
if(!fs.existsSync(sqlitePath)){
    fs.mkdirSync(sqlitePath)
}
const sqlite3 = sq3.verbose()
export const db = new sqlite3.Database(path.join(sqlitePath,'sq3.db'))

 db.serialize(() => {
    db.run("create table test(name varchar(20))", () => {
        db.run("insert into test values('nihao')", () => {
            db.all("select * from test", (err, res) => {
                if (err) throw err
                console.log(JSON.stringify(res))
            })
        })
    })
})