class MessagesController < ApplicationController
  def create
    message = current_user.sent_messages.build(message_params)
    message.save
    render json: message,
           status: 200
  end

  def destroy
    message_ids = params[:message_ids] || [params[:id]]
    Message.delete(message_ids) if logged_in?
    render json: {message_ids: message_ids}, status: 200
  end

  private
    def message_params
      params.require(:message).permit(:recipient_id, :subject, :body, :user_id, :recipe_id)
    end
end
