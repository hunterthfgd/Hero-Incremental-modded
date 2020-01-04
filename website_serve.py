from http import server, HTTPStatus
import os, json

class ModifiedHTTPRequestHandler(server.SimpleHTTPRequestHandler):

	def do_GET(self):
		f = self.send_head()
		if f:
			try:
				self.copyfile(f, self.wfile)
			finally:
				f.close()
	
	def do_POST(self):
		path = self.path
		content_length = int(self.headers['Content-Length']) # <--- Gets the size of data
		post_data = self.rfile.read(content_length).decode() # <--- Gets the data itself
		
		if 'makepost' in path:
			if not os.path.isfile('blogs/info.txt'):
				f = open('blogs/info.txt', 'w')
				f.write('[]')
				f.close()
			f = open('blogs/info.txt', 'r')
			info = json.loads(f.read())
			info['total'] += 1
			total = str(info['total'])
			f.close()
			f = open('blogs/info.txt', 'w')
			f.write(json.dumps(info))
			f.close()
			
			directory = 'blogs/posts' + total
			if not os.path.exists(directory):
				os.makedirs(directory)
				
			post_info = open('blogs/posts' + total + '/comments.txt', 'w')
			post_info.write('[]')
			post_info.close()
			
			template = open('blogs/template.html', 'r')
			postpage = template.read()
			template.close()
			
			page = open('blogs/posts' + total + '/posts' + total + '.html', 'w')
			page.write(postpage.replace('postnumber', total))
			page.close()
			
			file = open('blogs/posts' + total + '/posts' + str(info['total']) + '.txt', 'w')
			file.write(post_data)
			file.close()
			self.send_response(HTTPStatus.OK)
			self.send_header("Content-type", "text/html")
			self.end_headers()
			
		if 'makecomment' in path:
			data = json.loads(post_data)
			blog_num = str(data['blog_number'])
			
			comments_file = open('blogs/posts' + blog_num + '/comments.txt', 'r')
			comments = json.loads(comments_file.read().replace("'", '"'))
			comment_data = {"name": data['name'], "comment": data['comment']}
			comments.append(comment_data)
			comments_file.close()
			
			comments_file = open('blogs/posts' + blog_num + '/comments.txt', 'w')
			comments_file.write(str(comments))
			comments_file.close()
			self.send_response(HTTPStatus.OK)
			self.send_header("Content-type", "text/html")
			self.end_headers()
			
server.test(ModifiedHTTPRequestHandler, port=8000)