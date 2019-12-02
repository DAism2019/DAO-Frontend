import xlrd
import json


def convert():
    file = xlrd.open_workbook('multilanguage.xlsx')
    table = file.sheets()[0]  # get the table by index
    rows = table.nrows # get the amount of rows
    en = {}
    zh = {}
    for r in range(1,rows): # exclude the table head
        rowData = table.row_values(r) # get data of row
        str = rowData[0]
        en_str = rowData[1]
        zh_str = rowData[2]
        en[str] = en_str
        zh[str] = zh_str
    return en,zh


def main():
    en,zh = convert()
    # Writing JSON data
    with open('en.json', 'w') as f:
        json.dump(en, f)
    with open('zh-cn.json', 'w', encoding='utf-8') as f2:
        json.dump(zh, f2,ensure_ascii=False)
    with open('zh.json', 'w', encoding='utf-8') as f3:
        json.dump(zh, f3,ensure_ascii=False)
    print("convert to json successfully")


main()
