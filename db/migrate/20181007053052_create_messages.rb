class CreateMessages < ActiveRecord::Migration[5.2]
  def change
    create_table :messages do |t|
      t.string :subject
      t.text :body
      t.datetime :read_at
      t.integer :sender_id
      t.integer :recipient_id

      t.timestamps
    end
  end
end
