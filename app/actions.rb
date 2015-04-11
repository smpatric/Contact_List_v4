# Homepage (Root path)
require 'sinatra/json'
require 'pry'

get '/' do
  erb :index
end

get '/contacts' do
  @contacts = Contact.all
  json @contacts
end

get '/contact/:id' do
  # binding.pry
  contact = {}
  contact[:info] = Contact.find(params[:id])
  contact[:phones] = contact[:info].phones
  json contact
end

post '/contact/update/:id' do
  @contact = Contact.find(params[:id])
  @contact.firstname = params[:firstname]
  @contact.lastname = params[:lastname]
  @contact.email = params[:email]
  if @contact.save
    json @contact
  end
end

post '/contact/destroy/:id' do
  @contact = Contact.find(params[:id])
  if @contact.destroy
    json true
  end
end

post '/contact/new' do
  @contact = Contact.new(
    firstname: params[:firstname],
    lastname: params[:lastname],
    email: params[:email]
    )
  if @contact.save
    @phone = Phone.new(
      contact_id: @contact.id,
      number: params[:phone]
      )
  end
  if @phone.save
    json @contact
  end
end