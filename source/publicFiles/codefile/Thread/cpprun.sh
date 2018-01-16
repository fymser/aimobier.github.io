## 获取参数
fullfilename=$1
## 提取文件名称
tmp=${fullfilename##*/}
filename=${tmp%.*}
## 拼接 out file name
fileextension=".out"
filedict="out/"
outfile=${filedict}${filename}${fileextension}
rm -rf out
mkdir out
## 执行命令
c++ $fullfilename -o $outfile && ./$outfile
