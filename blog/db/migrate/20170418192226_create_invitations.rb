class CreateInvitations < ActiveRecord::Migration[5.0]
  def change
    create_table :invitations do |t|
      t.string :token, null: false
      t.references :user, foreign_key: true
      t.references :invitee, foreign_key: { to_table: :users }

      t.timestamps
    end
  end
end
