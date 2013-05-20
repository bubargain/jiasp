#-*- encoding: utf-8 -*-
#coding:utf-8
import urllib2
from bs4 import BeautifulSoup
import sys
import logging
from newsSpider import NewsSpider
import re,time
import urllib
import sys,os
from datetime import *
import time
import config

reload(sys)
sys.setdefaultencoding('utf-8') 


''' 
* 解析红袖网新闻页，并抓取最新的文章内容
* 规则：
     1. 自动爬取分页
     2. 只摘录分页>1 且小于20 的新闻
     3. 去除了“热文推荐”
     4. 去‘时尚导读：
     5：去除多余的空行和block
@auther：Daniel ma   
@date:20130513
'''
class graziaNewsSpider(NewsSpider):
    LOGGING_FILE=''
    Lists1 = ['celeb','beauty','living','fashion'] #URL 地址头
    Lists2=['Celeb','Beauty','Living','FASHION'] #URL 中间段地址
    
    def __init__(self):
        #配置log文件
        if os.name == "nt":
            self.LOGGING_FILE = config.WINDOWSLOGFILE+str(date.today())
        else:  
        #linux directory
            self.LOGGING_FILE = config.LINUXLOGFILE+str(datetime.now())
        logging.basicConfig(filename=self.LOGGING_FILE,level=logging.DEBUG)
    
    '''test whether simple factory run properly or not'''
    def test(self):
        print "Hi there! let's spide Grazia"
    
    
    '''
             按栏目解析整个grazia的新闻页面
    @param start : start position
    @param end   : end  position
    @param startList :  start list page position
    '''
    
    def start(self,start=1,end=2):
       
        for i in range(0,len(self.Lists1)):
            URL= self.Lists1[i]+'.grazia.com.cn'
            self.parseCategoryPageUrl(URL, i,start, end)
            
    '''
                    指定分类页面
    '''    
        
        
    def parseCategoryPageUrl(self,rURL,sub=0,start=1,end=3):
        import datetime
        for pages in range(start,end+1):
            URL=rURL
            if pages != 1:
                URL = rURL + '/html/'+self.Lists2[sub]+'/' +str(pages)+'.html'
            logging.info( "[Parse URL]:"+URL+" at "+str(datetime.datetime.now()))
            soup = self.parseUrl(URL)
            if soup != False: #网页访问正确
                sh_div = soup.find('div',class_='sh_div_1')
                if sh_div:
                    aTag =sh_div.find_all('a')   # <a> tags list
                    TagsArray = []
                    for i in range(0,len(aTag)):
                        oneATag = aTag[i]['href']
                        #过滤掉不是fashion。grazia开头的网址，以及不包含具体时间的链接
                        if re.search(rURL[:12],oneATag) and re.search('\d',oneATag):
                            try:
                                TagsArray.index(oneATag)
                            except:
                                TagsArray.append(oneATag)
                    #print TagsArray
                    for j in range(0,len(TagsArray)):
                        if self.setNewsCatagory(TagsArray[j]) != 'other':   #只分析我们指定的几个栏目
                            #print self.setNewsCatagory(TagsArray[j])
                            logging.info( 'News:'+TagsArray[j])
                            self.parseNewsPage(TagsArray[j],sub)
                          
        
    '''
        Parse list page of graiza.com
                    入口文件，通过爬取列表页获取最新文章的地址
        @param URL: 列表页的地址
    '''
    def parseListPageUrl(self,URL):
        soup =self.parseUrl(URL)
        #give html code to 'BeatifulSoup` module
        SoupRes= soup.find_all('h3',class_='bct_rth3')
        for i in range(0,len(SoupRes)):
            self.parseNewsPage(SoupRes[i].a['href'])
    
    '''parse one html page and return `soup` structure dom tree'''
    def parseUrl(self,URL):
        try:
            url=URL 
            if url[:7] != 'http://':
                 url = 'http://'+url
            '''if need to set parameters to URL'''
            #values ={'wd':'网球'}
            #encoded_param = urllib.parse.urlencode(values)
            #full_url = url + '?' +enocded_param
            
            #如果文章有分页，也同时解析分页的内容，并拼成一个整的html
            
            request = urllib2.Request(url)
            #request.add_header('Referer', url)
            res = urllib2.urlopen(request)
            return BeautifulSoup(res)
        except Exception as e:
            print e
            return False
    '''
                生成分页的URL地址
      @param sub :  网站分类的名称 
    '''      
    def subPageUrl(self,URL,page,sub):
        if page >1:
            URL,number = re.subn(self.Lists1[sub]+'.grazia.com.cn','www.grazia.com.cn/html/'+self.Lists2[sub],URL)
           
            if number > 0 :
                UrlChange = re.findall(r'\d+-',URL)
                for i in range (0,len(UrlChange)):
                    #print UrlChange[i]
                    URL,times = re.subn(UrlChange[i],str(UrlChange[i])[:-1]+'/',URL)
                
                if URL[-5:]== '.html':
                    URL = URL[:-5]
                return URL+'_'+str(page)+'.html'   
        return URL
    
    '''
                    处理相对地址,并返回完整地址
        @param content :   字符串形式的HTML源码
        @param hostHead:   图片实际地址前缀
        @return: 修正后的html代码 
    '''
    def handlePicLocation(self,Content,hostHead):
        newContent= re.sub(r'src="/',r'src="'+hostHead+'/',Content)
        return newContent
    
    '''
               获取正文的内容,并处理分页信息
      @auther：Daniel ma   
      @date:20130513
    '''
    def subPageContent(self,URL,sub):
        #handle page address bottom
        #如果页面超过20张，即超过20张图片，则忽略此新闻
        try:
            '''规则二：'''
            res = urllib2.urlopen(self.subPageUrl(URL,2,sub))
            if res.geturl()!= self.subPageUrl(URL,2,sub):     #第二页不存在
                return False
            res = urllib2.urlopen(self.subPageUrl(URL,21,sub))
            if res.geturl() == self.subPageUrl(URL,21,sub):   #超过20个分页 
                return False
            
            newsContent=''
            
            for i in range(1,20):  # assume maxium
                time.sleep(0.2) #sleep 0.2s between each page calling
                nURL = self.subPageUrl(URL,i,sub)
                response = urllib2.urlopen(nURL)
                if response.geturl() == nURL : #页面有效，未被跳转
                    soup = BeautifulSoup(response)
                    soupPTag= soup.find('div',class_='gtext_text')
                    '''规则三：去’热门推荐‘ '''
                    '''
                                                            规则四： 去‘时尚导读：’
                                                            连续删除时尚导读及其后的5个的<P>内容
                    '''
                    for tag in soupPTag.find_all('p'):
                        #有特殊颜色的span都不要
                        if tag.find('span') != None:
                            continue
                        elif str(tag.strong) =='<strong>时尚导读：</strong>':
                            break 
                        elif tag.img:
                            del tag.img['style']
                        newsContent = newsContent + str(tag)
                        
                        '''规则五：去除多余的空行和block'''
                        newsContent = re.sub('<p>\W*</p>','',newsContent)    
                                        
            return self.handlePicLocation(newsContent,'http://img.cdn.grazia.com.cn')
          
        except Exception as e:
            logging.error( e)
            return False
                    
      
    '''
                    将日期字符串格式化类如2013-05-12的格式，如果转化异常，则返回当天的日期
        @param date:  parsed date str
        @return： formated datetime ,like '2013-05-12'
        @author: Daniel ma
        @since: 2013/05/14
    
    '''
    
    @staticmethod
    def timeFormatTransfer(date):
        import datetime
        rgDate = re.search('\d+年\d+月\d+日',date)
        fDate= datetime.date.today()
        try:
            tempDate = rgDate.group()
            return tempDate[:4]+'-'+tempDate[7:9]+'-'+tempDate[12:14]
        except:
            return fDate
    
    '''
                    终点文件，获取新闻信息并post到指定接口
        parse URL like 'http://fashion.grazia.com.cn/Fashion-TRENDS/2013-0510-13394' 
    '''
            
    def parseNewsPage(self,URL,sub):
        #print "ParseNewsPage:",URL
        soup= self.parseUrl(URL)
        soupRes={}
        gtext = soup.find('div', class_="gtext")
        if gtext:
            soupRes['neirong'] = self.subPageContent(URL,sub)      
            soupRes['pic']=''
            soupRes['description'] = gtext.find('gintro')
            soupRes['title'] = gtext.h1.text
            
            date = gtext.find('div',class_='gdate')
            soupRes['date_str'] = self.timeFormatTransfer(str(date))
            soupRes['from'] = self.setNewsCatagory(URL)
            soupRes['from_url'] =URL
            soupRes['buy_url'] =''
            soupRes['focus'] =0
           
            '''
                POST 到接口文件
            '''
            #print soupRes['neirong']   
        
            logging.info( self.post(config.API,soupRes))
            print "finished URL:",URL,' at ',str(datetime.now())
            #print soupRes['neirong']
        else:
            logging.error( "not found gtext tag")
    
    



    '''静态函数，解析文章属于哪一个分类'''
    @staticmethod
    def setNewsCatagory(URL):
        #delete 'http://' if exist
        URL = re.sub('[\w\.:/]*grazia\.com\.cn/','',URL)
        pattern = re.compile(r'[\w\.-]*')
        match = pattern.match(URL)
        if match:
            #print match.group()
            catagory= match.group()
            #switch sentence in python
            result = {
                'fashion' : u"时装潮流",
                'HOT-BUY'  : u'时髦单品',
                'Fashion-TRENDS'  : u'潮流播报',
                'PICKS-MIX'    : u'潮流搭配',
                'ACCESORIES' : u'潮流配饰',
                'Gossip' :u'星闻星事',
                'Cover':u'封面明星',
                'Interview':u'名人访谈',
                'Up-down':u'明星红黑榜',
                'Fashion-experts':u'名人风格',
                'CelebritySpotlight':u'名利场',
                'Beauty-TRENDS':u'美容情报',
                'HOT-ITEM':u'热门单品',
                'makeup-TIPS':u'彩妆功略',
                'hair-tips':u'美发贴士',
                'BEAUTY-CLASS':u'美肤课堂',
                'HEALTH':u'美体健康',
                'Recipe':u'美食',
                'Travel':u'旅行',
                'Relationship':u'关系',
                'Collection':u'娱乐资讯',
                'Art':u'艺术',
                'Fun':u'泛生活'
                      
            }
            if result.has_key(catagory) :
                return result[catagory]  
            else:
                return 'other'

        else:
            return 'other'
                

    