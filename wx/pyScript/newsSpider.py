#!encoding:utf-8

''' 
爬虫的接口类
其他爬虫必须继承此类以方便抽象工厂的自动选择
@author:  Daniel Ma
20130512
'''
import urllib2,urllib
from bs4 import BeautifulSoup  
import config
import os

class NewsSpider():
    API =''
    def __init__(self):
        pass

    
    '''
            用于测试继承类的调用是否成功
    @return BeautifulSoup Dom tree object
    '''
    def test(self):
        print "this is a test from NewsSpider"
    
    def start(self,start,end):
        print '函数未能成功继承'
        
    def parseUrl(self,URL):
      
        try:
            url=URL 
            if url[:7] != 'http://':
                 url = 'http://'+url
            '''if need to set parameters to URL'''
            request = urllib2.Request(url)
            res = urllib2.urlopen(request)
            if os.name == "nt":   #windows环境，使用默认的html parser
                return BeautifulSoup(res)
            else :
                return BeautifulSoup(res,'lxml')
        except Exception as e:
            print '[ERROR in parse URL]:',e
            raise
    
    '''
        post value to URL
    '''   
    def post(self,url, data):  
        req = urllib2.Request(url)  
        data = urllib.urlencode(data)  
        #enable cookie  
        opener = urllib2.build_opener(urllib2.HTTPCookieProcessor())  
        response = opener.open(req, data)  
        return response.read().decode('utf8')
    
    '''
             解析主分类页
    '''
    def parseCategoryPageUrl(self,rURL,start,end):
        pass
     
    '''
            解析列表页
    '''
    def parseListPageUrl(self,URL):
        pass
    
    '''
            解析具体新闻页
    '''
    def parseNewsPage(self,URL):
        pass