	
	//定位文档中的元素
	function findObj(theObj, theDoc)// Example: obj = findObj("image1");
	{ 
	var p, i, foundObj; 
	if(!theDoc) theDoc = document; 
	if( (p = theObj.indexOf("?")) > 0 && parent.frames.length) 
	{    theDoc = parent.frames[theObj.substring(p+1)].document;  
	     theObj = theObj.substring(0,p); }
		 if(!(foundObj = theDoc[theObj]) && theDoc.all)
		   foundObj = theDoc.all[theObj]; 
		   for (i=0; !foundObj && i < theDoc.forms.length; i++)   
		     foundObj = theDoc.forms[i][theObj];
			  for(i=0; !foundObj && theDoc.layers && i < theDoc.layers.length; i++)    
			   foundObj = findObj(theObj,theDoc.layers[i].document);
			    if(!foundObj && document.getElementById) foundObj = document.getElementById(theObj);  
				  return foundObj;
	}

    //为产品列表table添加一行，最多8行
	function addSignRow(){
		 //读取最后一行的行号，存放在txtTRLastIndex文本框中 
		var txtTRLastIndex = findObj("txtTRLastIndex",document);
		var rowID = parseInt(txtTRLastIndex.value);
		if(rowID < 8)
		{
			var signFrame = findObj("tbProductList",document);
			//添加行
			var newTR = signFrame.insertRow(signFrame.rows.length);
			newTR.id = "SignItem" + rowID;
			
			//添加列:产品名称及型号
			var newNameTD=newTR.insertCell(0);
			//添加列内容
			newNameTD.innerHTML = "<input name='ipProductName" + rowID + "'type='text' style='width:100px' />";
			
			//添加列:brand
			var newNameTD=newTR.insertCell(1);
			//添加列内容
			newNameTD.innerHTML = "<input name='ipProductBrand" + rowID + "'type='text' style='width:60px'/>";
			
			//添加列:site
			var newNameTD=newTR.insertCell(2);
			//添加列内容
			newNameTD.innerHTML = "<input name='ipProductSite" + rowID + "'type='text' style='width:150px' />";
			
			//将行号推进下一行
			txtTRLastIndex.value = (rowID + 1).toString() ;
		}
		else
		{
			findObj("addTrAlert",document).style.display='';
		}
	}