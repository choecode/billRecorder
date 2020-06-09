export default function execute(db, sql) {
    return new Promise((resolve, reject) => {
        if (Array.isArray(sql)) {
           // console.log(sql)
            db.transaction(tx => {
                sql.forEach(item => {
                    tx.executeSql(item)
                })
            }, ( data,err) => {
                console.log(data,err)
                reject(data)
            }, ( data) => {
                console.log(data)
                resolve (data)
            })
        }else{
            db.transaction(tx => {
                tx.executeSql(sql, null, (tx, data) => {
                    resolve(data)
                }, (tx, data) => {
                    reject(data)
                })
            })
        }
        
    })
}