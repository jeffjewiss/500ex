
require 'cgi'
require 'digest/md5'
require 'net/https'
require 'uri'
require 'json'
require 'liquid'


module Jekyll
  class DPxImgTag < Liquid::Tag

    TOKEN = 'TFAVTvlBmz7OSI740vRbWKKkwlQ7lfslFBWQYnG8'

    def initialize(tag_name, id, tokens)
      super
      @id = id.strip
    end

    def render(context)
      json = get_photo_from_web @id
      html_output_for json["image_url"]
    end

    def html_output_for(photo_url)
      <<-HTML
<figure>
  <img src='#{photo_url}' data-photo-id='#{@id}' />
</figure>
      HTML
    end

    def get_url_for_request(id)
      return "https://api.500px.com/v1/photos/#{id}/?consumer_key=#{TOKEN}"
    end

    def get_photo_from_web(id)
      request_url       = get_url_for_request id
      raw_uri           = URI.parse request_url
      proxy             = ENV['http_proxy']
      if proxy
        proxy_uri       = URI.parse(proxy)
        https           = Net::HTTP::Proxy(proxy_uri.host, proxy_uri.port).new raw_uri.host, raw_uri.port
      else
        https           = Net::HTTP.new raw_uri.host, raw_uri.port
      end
      https.use_ssl     = true
      https.verify_mode = OpenSSL::SSL::VERIFY_NONE
      request           = Net::HTTP::Get.new raw_uri.request_uri
      data              = https.request request
      data              = JSON.parse(data.body)
      data              = data["photo"]
      # cache gist, file, data unless @cache_disabled
      data
    end

  end
end

Liquid::Template.register_tag('500px', Jekyll::DPxImgTag)









@template = Liquid::Template.parse("{% 500px 7285260 %}")
puts @template.render








