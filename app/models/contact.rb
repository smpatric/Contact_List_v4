class Contact < ActiveRecord::Base
  has_many :phones, dependent: :destroy
end