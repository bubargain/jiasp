#-*- coding:utf-8 -*-

import logging,time,re
import newsSpider
from datetime import *
from bs4 import BeautifulSoup
import urllib,urllib2
import config
import sys

reload(sys)
sys.setdefaultencoding('utf-8') 

'''
    @note: 自动爬取海报网的最新新闻
    @author: daniel ma
    @since: 2013-05017
'''
class haibaoNewsSpider(newsSpider.NewsSpider):
    CatagoryList = ['beauty','fashion','stars','diy','brands','accessory','JewelryWatch','wedding']  #海报网的目录名in urls
    imgMaxNumber  = 20  #如果文章中图片数大于20，则放弃该文章
    API = ''
    
    def parseCategoryPageUrltest(self):
        print "this is Haibao spider"
    
    def test(self):
        print "Hi there! Let's spide Haibao"
    
    
    '''
                自启动函数
               自动爬取所有目录的第1,3页
    '''
    def start(self,start=1,end=2):
        self.parseCategoryPageUrl('www.haibao.cn/',start,end)
    
           
    '''
             解析主分类页
    '''
    def parseCategoryPageUrl(self,rURL,start,end):
        try:
            if rURL[:7] != 'http://':
                rURL = 'http://'+rURL
            URL = rURL
            for i in range(0, len(self.CatagoryList)):
                catagoryURL= URL +self.CatagoryList[i]+'/'
                self.parseListPageUrl(catagoryURL,i)
        except Exception as e:
            print '[Error] at Parse Category :',e
     
    '''
            解析列表页
    '''
    def parseListPageUrl(self,URL,catagoryId):
        try:
            HTML = self.parseUrl(URL)
            HTMLContent = HTML.find('div',class_='art') #寻找正文
            aTags= HTMLContent.find_all('a',href=re.compile('\w*htm$'))
            targetArticle={}
            for aTag in aTags:
                if aTag['href'][0] == '/':  #相对地址
                    tmpURL = 'http://www.haibao.cn'+aTag['href']
                    if not targetArticle.has_key(tmpURL):
                        targetArticle[tmpURL]=''
            targetURLs= targetArticle.keys()
            for i in targetURLs:
                print 'start ',i,' at ',str(datetime.now())
                self.parseNewsPage(i,catagoryId)
        except Exception as e:
            print '[Error] at parse List :' ,e
    
    
    @staticmethod
    def getCatagory(id):
        if id == 0:
            return '美容趋势'
        elif id == 1:
            return '时装趋势'
        elif id == 2:
            return '明星'
        elif id == 3:
            return '生活'
        elif id == 4:
            return '时尚品牌'
        elif id == 5:
            return '配饰'
        elif id == 6:
            return '珠宝腕表'
        elif id == 7:
            return '婚礼'
        else: 
            return 'other'
    
    '''
            解析具体新闻页
    '''
    def parseNewsPage(self,URL,catagoryId):
        try:
            
            HTML = self.parseUrl(URL)
            HTMLContent = HTML.find('div',class_='art')  
            # Main Article
            soupResult={}
            neirong = self.subPageContent(URL)
            if neirong != False and neirong != '':
                soupResult['title']    =  HTMLContent.h1.text
                soupResult['from']     =  self.getCatagory(catagoryId)
                soupResult['date_str'] =  HTMLContent.find('div',class_='art_timel').span.text  
                soupResult['neirong']  =  neirong 
                soupResult['from_url'] =  URL
                self.post(config.API, soupResult)
                       
        except Exception as e:
            print '[Error in News Page] :',e


    '''
                爬取分页，并获取完整正文内容
    '''
    def subPageContent(self,URL):        
        try:
            '''规则：文章分页需大于2页并小于20页，否则不摘录'''
            if not self.PageExist(URL,2): return False
            if self.PageExist(URL,21): 
                print 'too many pages'
                return False
            
            content =''
            totalImgNumber =0
            for i in range(1,20):
                subUrl = self.PageExist(URL, i)
                if not subUrl:
                    break
                            
                HTML =self.parseUrl(subUrl)
                try:
                    HTMLbody = HTML.find('div',class_='news_body')
                    tmpcount = HTMLbody.find_all('img')
                    totalImgNumber += len(tmpcount)
                    if totalImgNumber > self.imgMaxNumber:
                        print "img number larger than ",self.imgMaxNumber
                        return False
                    
                    for tag in HTMLbody():
                        
                        '''规则:  剔除"点击进入" 和"相关文章" 等导航 '''
                        
                        if re.search('(点击进入)|(相关文章)',str(tag)):
                            tag.extract()
                        for Attribute in ['style','href','target','id','class','name']:
                            del tag[Attribute]
                        
                        '''规则： 去除<br/>和空的<p>'''    
                        tmpContent = str(HTMLbody)
                        tmpContent = re.sub('</?br/?>','',tmpContent)
                        tmpContent = re.sub('(<p>\b*</p>)|(<a>)','',tmpContent)
                            
                    content +=tmpContent
                    #print content
                except:
                    print 'content not found'
            return str(content)
        except Exception as e:
            print '[Error in subPageContent] :' ,e
            return False




    '''
            测试分页是否存在
     @param URL: the first page URl
     @param pos:  sub-page number
     @return:  True if page exist, false otherwise        
     
     @author: Daniel Ma     2013.5.17
    '''
    def PageExist(self,URL,pos):
        if URL[:7] != 'http://':  # add 'http' head if not exist
            URL = 'http://'+URL
        if pos > 1 and URL[-4:] == '.htm':  #delete the '.htm'
            URL = URL[:-4] + '_'+str(pos)+'.htm'
        res = urllib2.urlopen(URL)
        if res.geturl()!= URL:
            #print 'error'
            return False
        else:
            #print 'ok'
            return URL


if __name__ == '__main__':
    spider = haibaoNewsSpider()
    spider.parseNewsPage('http://www.haibao.cn/article/1525887.htm',1)
    
