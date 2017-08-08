class AddUserToUpdate < ActiveRecord::Migration[5.0]
  def change
    add_reference :updates, :user, foreign_key: true
  end
end
