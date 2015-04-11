class CreateTables < ActiveRecord::Migration
  def change
    create_table :contacts do |t|
      t.string :firstname
      t.string :lastname
      t.string :email
      t.string :address
    end

    create_table :phones do |t|
      t.belongs_to :contact, index: true
      t.string :number
    end
  end
end