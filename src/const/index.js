var host =  window.location.host;
var isGitee = host=="choecode.github.io"
export default {
    BILL_CSV_FILE_URL:isGitee?"https://joker12345.gitee.io/bill.csv":"https://raw.githubusercontent.com/xmindltd/hiring/master/frontend-1/bill.csv",
   
    CATEGORY_CSV_FILE_URL:isGitee?"https://joker12345.gitee.io/categories.csv":"https://raw.githubusercontent.com/xmindltd/hiring/master/frontend-1/categories.csv"
    
}